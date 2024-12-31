<?php

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $permission = new Permission();
        $permission->name = 'manage_variations';
        $permission->display_name = 'Manage Variations';
        $permission->save();

        $adminRole = Role::whereName(Role::ADMIN)->first();
        $adminRole->givePermissionTo($permission->id);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $permission = Permission::where('name', 'manage_variations')->first();
        if($permission) $permission->delete();
    }
};
