<?php

use App\Models\Setting;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $setting = new Setting();
        $setting->key = 'show_logo_in_receipt';
        $setting->value = 1;
        $setting->save();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $setting = Setting::where('key', 'show_logo_in_receipt')->first();
        $setting->delete();
    }
};
