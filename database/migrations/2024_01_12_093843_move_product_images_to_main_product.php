<?php

use App\Models\MainProduct;
use App\Models\Product;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $products = Product::all();
        foreach ($products as $product) {
            $medias = $product->getMedia(Product::PATH);
            $mainProduct = MainProduct::where('code', $product->product_code)->first();


            if ($medias->count() > 0) {
                foreach ($medias as $mediaItem) {
                    $mediaItem->copy($mainProduct, MainProduct::PATH, config('app.media_disc'));
                }
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('main_product', function (Blueprint $table) {
            //
        });
    }
};
