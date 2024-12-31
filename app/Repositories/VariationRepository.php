<?php

namespace App\Repositories;

use App\Models\Variation;
use App\Models\VariationType;
use Exception;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

/**
 * Class UserRepository
 */
class VariationRepository extends BaseRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'name',
        'created_at',
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
        return Variation::class;
    }


    public function store($input)
    {
        try {
            DB::beginTransaction();
            $variation = $this->create($input);
            if (isset($input['variation_types'])) {
                foreach ($input['variation_types'] as $type) {
                    VariationType::create([
                        'name' => $type['name'],
                        'variation_id' => $variation->id,
                    ]);
                }
            }
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($e->getMessage());
        }

        return $variation;
    }

    public function update($input, $id)
    {
        try {
            DB::beginTransaction();

            $variation = Variation::findOrFail($id);
            $variation->update([
                'name' => $input['name'],
            ]);


            $input['deleted_variation_types'] = $input['deleted_variation_types'] ?? [];
            foreach ($input['deleted_variation_types'] as $type) {
                if (isset($type['id'])) {
                    $variationType = VariationType::withCount('variationProducts')->findOrFail($type['id']);
                    if ($variationType->variation_products_count) {
                        throw new UnprocessableEntityHttpException('Variation Type "' . $variationType->name .
                            '" is already in use');
                        return false;
                    }
                    $variationType->delete();
                }
            }

            foreach ($input['variation_types'] as $type) {
                if (isset($type['id'])) {
                    VariationType::where('id', $type['id'])->update([
                        'name' => $type['name'],
                    ]);
                } else {
                    VariationType::create([
                        'name' => $type['name'],
                        'variation_id' => $variation->id,
                    ]);
                }
            }

            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($e->getMessage());
        }

        return $variation;
    }
}
