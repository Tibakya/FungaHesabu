<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\AppBaseController;
use App\Http\Requests\CreateMainProductRequest;
use App\Http\Requests\UpdateMainProductRequest;
use App\Http\Resources\MainProductCollection;
use App\Http\Resources\MainProductResource;
use App\Models\MainProduct;
use App\Models\Product;
use App\Models\PurchaseItem;
use App\Models\SaleItem;
use App\Models\VariationProduct;
use App\Repositories\MainProductRepository;
use App\Repositories\ProductRepository;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

class MainProductAPIController extends AppBaseController
{
    /** @var MainProductRepository */
    private $mainProductRepository;

    public function __construct(MainProductRepository $mainProductRepository)
    {
        $this->mainProductRepository = $mainProductRepository;
    }


    public function index(Request $request)
    {
        $perPage = getPageSize($request);
        $products = $this->mainProductRepository;

        if ($request->get('product_unit')) {
            $products->where('product_unit', $request->get('product_unit'));
        }

        if ($request->get('warehouse_id') && $request->get('warehouse_id') != 'null') {
            $warehouseId = $request->get('warehouse_id');
            $products->whereHas('stock', function ($q) use ($warehouseId) {
                $q->where('manage_stocks.warehouse_id', $warehouseId);
            })->with([
                'stock' => function (HasOne $query) use ($warehouseId) {
                    $query->where('manage_stocks.warehouse_id', $warehouseId);
                },
            ]);
        }

        $products = $products->paginate($perPage);
        MainProductResource::usingWithCollection();

        return new MainProductCollection($products);
    }

    public function show($id): MainProductResource
    {
        /** @var MainProduct $mainProduct */
        $mainProduct = $this->mainProductRepository->find($id);

        return new MainProductResource($mainProduct);
    }

    public function store(CreateMainProductRequest $request): MainProductResource
    {
        $input = $request->all();

        if ($input['barcode_symbol'] == Product::EAN8 && strlen($input['code']) != 7) {
            return $this->sendError('Please enter 7 digit code');
        }

        if ($input['barcode_symbol'] == Product::UPC && strlen($input['code']) != 11) {
            return $this->sendError(' Please enter 11 digit code');
        }

        try {
            DB::beginTransaction();

            $productRepo = app(ProductRepository::class);
            $mainProduct = MainProduct::create([
                'name' => $input['name'],
                'code' => $input['product_code'],
                'product_unit' => $input['product_unit'],
                'product_type' => $input['product_type'],
            ]);

            if (isset($input['images']) && !empty($input['images'])) {
                foreach ($input['images'] as $image) {
                    $product['image_url'] = $mainProduct->addMedia($image)->toMediaCollection(
                        MainProduct::PATH,
                        config('app.media_disc')
                    );
                }
            }

            $input['main_product_id'] = $mainProduct->id;
            if ($input['product_type'] == 2) {
                $commonProductInput = Arr::except($input, 'variation_data');

                $variationData = $input['variation_data'];
                foreach ($variationData as $key => $variation) {
                    $variation = array_merge($variation, $commonProductInput);
                    $product = $productRepo->storeProduct($variation);

                    VariationProduct::create([
                        'product_id' => $product->id,
                        'variation_id' => $variation['variation_id'],
                        'variation_type_id' => $variation['variation_type_id'],
                        'main_product_id' => $mainProduct->id,
                    ]);
                }
            } else {
                $product = $productRepo->storeProduct($input);
            }
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($e->getMessage());
        }

        return new MainProductResource($product);
    }

    public function update(UpdateMainProductRequest $request, $id): MainProductResource
    {
        $input = $request->all();
        $mainProduct = MainProduct::find($id);

        $mainProduct->update([
            'name' => $input['name'],
            'code' => $input['product_code'],
            'product_unit' => $input['product_unit'],
        ]);


        if (isset($input['images']) && !empty($input['images'])) {
            foreach ($input['images'] as $image) {
                $product['image_url'] = $mainProduct->addMedia($image)->toMediaCollection(
                    MainProduct::PATH,
                    config('app.media_disc')
                );
            }
        }

        $products = Product::with('variationType')->where('main_product_id', $id)->get();

        foreach ($products as $product) {
            if ($mainProduct->product_type == MainProduct::VARIATION_PRODUCT) {
                $input['code'] = $input['product_code'] . '-' . strtoupper($product->variationType->name);
            } else {
                $input['code'] = $input['product_code'];
            }
            $productRepo = app(ProductRepository::class);
            $product = $productRepo->updateProduct($input, $product->id);
        }

        return new MainProductResource($product);
    }

    public function destroy($id): JsonResponse
    {
        try {
            DB::beginTransaction();
            $products = Product::where('main_product_id', $id)->get();

            foreach ($products as $product) {

                $purchaseItemModels = [
                    PurchaseItem::class,
                ];
                $saleItemModels = [
                    SaleItem::class,
                ];

                $purchaseResult = canDelete($purchaseItemModels, 'product_id', $product->id);
                $saleResult = canDelete($saleItemModels, 'product_id', $product->id);

                if ($purchaseResult || $saleResult) {
                    return $this->sendError(__('messages.error.product_cant_deleted'));
                }

                if (File::exists(Storage::path('product_barcode/barcode-PR_' . $product->id . '.png'))) {
                    File::delete(Storage::path('product_barcode/barcode-PR_' . $product->id . '.png'));
                }
                $product->delete();
            }

            VariationProduct::where('main_product_id', $id)->delete();

            $this->mainProductRepository->delete($id);
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError($e->getMessage());
        }

        return $this->sendSuccess('Product deleted successfully');
    }
}
