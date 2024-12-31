<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\AppBaseController;
use App\Http\Requests\CreateVariationRequest;
use App\Http\Requests\UpdateVariationRequest;
use App\Http\Resources\VariationCollection;
use App\Http\Resources\VariationResource;
use App\Models\variation;
use App\Repositories\VariationRepository;
use Illuminate\Http\Request;

class VariationAPIController extends AppBaseController
{

    /** @var  VariationRepository */
    protected $variationRepository;

    public function __construct(VariationRepository $variationRepo)
    {
        $this->variationRepository = $variationRepo;
    }

    public function index(Request $request)
    {
        $perPage = getPageSize($request);
        $variations = $this->variationRepository;
        $variations = $variations->paginate($perPage);

        VariationResource::usingWithCollection();

        return new VariationCollection($variations);
    }

    public function show(Variation $variation)
    {
        return new VariationResource($variation);
    }

    public function store(CreateVariationRequest $request)
    {

        $input = $request->all();

        $variation = $this->variationRepository->store($input);

        return new VariationResource($variation);
    }

    public function update(UpdateVariationRequest $request, $id)
    {
        $input = $request->all();

        $variation = $this->variationRepository->update($input, $id);

        return new VariationResource($variation);
    }

    public function destroy($id)
    {
        $variation = $this->variationRepository->withCount('variationProducts')->find($id);
        if ($variation->variation_products_count) {
            return $this->sendError('This Variation is already in use');
        }

        $variation->delete();

        return $this->sendSuccess('Variation deleted successfully');
    }
}
