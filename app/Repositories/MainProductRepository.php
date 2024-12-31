<?php

namespace App\Repositories;

use App\Models\MainProduct;

/**
 * Class MainProductRepository
 */
class MainProductRepository extends BaseRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'name',
        'code',
        'product_unit',
        'created_at',
    ];

    /**
     * @var string[]
     */
    protected $allowedFields = [
        'name',
        'code',
        'product_unit',

    ];

    /**
     * Return searchable fields
     */
    public function getFieldsSearchable(): array
    {
        return $this->fieldSearchable;
    }

    /**
     * Configure the Model
     **/
    public function model()
    {
        return MainProduct::class;
    }
}
