<?php

namespace App\Models;

use App\Models\Contracts\JsonResourceful;
use App\Traits\HasJsonResourcefulData;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class VariationProduct extends BaseModel implements JsonResourceful
{
    use HasFactory, HasJsonResourcefulData;

    protected $fillable = [
        'main_product_id',
        'product_id',
        'variation_id',
        'variation_type_id',
    ];

    protected $casts = [
        'main_product_id' => 'integer',
        'product_id' => 'integer',
        'variation_id' => 'integer',
        'variation_type_id' => 'integer',
    ];

    public function mainProduct()
    {
        return $this->belongsTo(MainProduct::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function variation()
    {
        return $this->belongsTo(Variation::class);
    }

    public function variationType()
    {
        return $this->belongsTo(VariationType::class);
    }

    public function prepareAttributes(): array
    {
        return [
            'main_product_id' => $this->main_product_id,
            'product_id' => $this->product_id,
            'variation_id' => $this->variation_id,
            'variation_type_id' => $this->variation_type_id,
            'variation_name' => $this->variation->name ?? '',
            'variation_type_name' => $this->variationType->name ?? '',
        ];
    }
    public function prepareLinks(): array
    {
        return [];
    }
}
