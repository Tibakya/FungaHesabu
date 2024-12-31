<?php

namespace App\Http\Requests;

use App\Models\Product;
use Illuminate\Foundation\Http\FormRequest;

class CreateMainProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        if (request()->get('product_type') == 1) {
            return Product::$rules;
        }

        if (request()->get('product_type') == 2) {
            $variationData = json_decode(request()->get('variation_data'), true);
            $this->merge([
                'variation_data' => $variationData,
            ]);

            return [
                'name' => 'required',
                'product_code' => 'required|unique:products',
                'product_category_id' => 'required|exists:product_categories,id',
                'brand_id' => 'required|exists:brands,id',
                'product_unit' => 'required',
                'sale_unit' => 'nullable',
                'purchase_unit' => 'nullable',
                'quantity_limit' => 'nullable',
                'notes' => 'nullable',
                'barcode_symbol' => 'required',
                'images.*' => 'image|mimes:jpg,jpeg,png',
                'variation_data.*.product_cost' => 'required|numeric',
                'variation_data.*.product_price' => 'required|numeric',
                'variation_data.*.stock_alert' => 'nullable',
                'variation_data.*.order_tax' => 'nullable|numeric',
                'variation_data.*.tax_type' => 'nullable',
                'variation_data.*.code' => 'required|unique:products',
            ];
        }
        return [];
    }

    public function messages(): array
    {
        return [
            'code.unique' => __('messages.error.code_taken'),
            'variation_data.*.product_cost.required' => 'The product cost field is required.',
            'variation_data.*.product_price.required' => 'The product price field is required.',
            'variation_data.*.product_cost.numeric' => 'The product cost must be a number.',
            'variation_data.*.product_price.numeric' => 'The product price must be a number.',
            'variation_data.*.order_tax.numeric' => 'The order tax must be a number.',
            'variation_data.*.code.unique' => 'The code has already been taken.',
        ];
    }
}
