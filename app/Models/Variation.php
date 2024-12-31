<?php

namespace App\Models;

use App\Traits\HasJsonResourcefulData;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\Variation
 *
 * @property int $id
 * @property string $name
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\VariationType> $variation_types
 * @property-read int|null $variation_types_count
 * @method static \Illuminate\Database\Eloquent\Builder|Variation newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Variation newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Variation query()
 * @method static \Illuminate\Database\Eloquent\Builder|Variation whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Variation whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Variation whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Variation whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Variation extends BaseModel
{
    use HasFactory, HasJsonResourcefulData;

    const JSON_API_TYPE = 'variations';

    protected $fillable = [
        'name',
    ];

    public function prepareLinks(): array
    {
        return [
            'self' => route('variations.show', $this->id),
        ];
    }


    public function prepareAttributes(): array
    {

        foreach ($this->variation_types as $type) {
            $variation_types[] = [
                'id' => $type->id,
                'name' => $type->name,
            ];
        }

        $fields = [
            'id' => $this->id,
            'name' => $this->name,
            'variation_types' => $variation_types ?? [],
        ];

        return $fields;
    }

    /**
     *
     * @return HasMany
     */
    public function variation_types(): HasMany
    {
        return $this->hasMany(VariationType::class);
    }

    public function variationProducts(): HasMany
    {
        return $this->hasMany(VariationProduct::class);
    }
}
