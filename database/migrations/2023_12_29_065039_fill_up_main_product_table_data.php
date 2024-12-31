<?php

use App\Models\MainProduct;
use App\Models\Product;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::beginTransaction();
        $products = Product::with('variationProduct')->select('id','name','product_code','product_unit')->get();
            foreach($products as $product){
                $mainProduct = MainProduct::where('code',$product->product_code)->first();

                if(!$mainProduct){
                    $mainProduct = new MainProduct();
                    $mainProduct->name = $product->name;
                    $mainProduct->code = $product->product_code;
                    $mainProduct->product_unit = $product->product_unit;
                    $mainProduct->product_type = $product->variationProduct ? MainProduct::VARIATION_PRODUCT : MainProduct::SINGLE_PRODUCT;
                    $mainProduct->save();
                }

                $product->update([
                    'main_product_id' => $mainProduct->id
                ]);

                if($product->variationProduct){
                    $product->variationProduct->update([
                        'main_product_id' => $mainProduct->id
                    ]);
                }

            }
            DB::commit();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
