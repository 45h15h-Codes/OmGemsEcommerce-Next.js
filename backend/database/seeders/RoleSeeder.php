<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

/**
 * RoleSeeder — Granular Permission Architecture
 *
 * Implements a strict, auditable permission matrix following the principle of
 * least privilege. Every action a user can take maps to a discrete permission
 * string. Super Admin bypasses all checks via Gate::before() in AppServiceProvider,
 * so it receives NO explicit permissions here — keeping the permission table clean
 * and the audit trail unambiguous.
 *
 * Permission Naming Convention:
 *   {action}_{resource}        — e.g. manage_diamonds, view_orders
 *   {action}_own_{resource}    — scoped to the authenticated user's own data
 *
 * Security Note (api-security-best-practices):
 *   - Every mutation route MUST be gated by its permission string via middleware.
 *   - IDOR is prevented at the query layer (scoping), NOT the permission layer.
 *   - The middleware only checks "can this role do this type of action?"
 *   - The controller query scope checks "can this user touch THIS specific record?"
 */
class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // ─────────────────────────────────────────────────────
        // 1. Define the complete permission registry
        // ─────────────────────────────────────────────────────

        $permissions = [
            // ── Admin / CMS Permissions ──────────────────────
            'view_admin_dashboard',
            'manage_diamonds',         // Full CRUD on ALL diamonds
            'manage_products',         // Full CRUD on ALL products
            'manage_categories',       // Full CRUD on ALL categories
            'products.view',
            'products.create_edit',
            'products.edit_price',
            'products.edit_cost',
            'products.delete',
            'products.publish',
            'inventory.manage',
            'categories.manage',
            'collections.manage',
            'media.view',
            'media.upload',
            'media.delete',
            'seo.manage',
            'roles.manage',
            'settings.manage',
            'manage_orders',           // View/update ALL orders
            'manage_users',            // User CRUD + role/permission assignment
            'manage_settings',         // Site-wide config, payment gateways, etc.
            'view_reports',            // Revenue analytics, export data

            // ── Partner (Vendor) Permissions ─────────────────
            'manage_own_diamonds',     // CRUD scoped to vendor_id = auth()->id()
            'view_own_orders',         // Orders containing this vendor's stones
            'update_own_profile',      // Own profile/company info only

            // ── Wholesale Buyer Permissions ──────────────────
            'place_bulk_orders',       // Bulk/B2B order submission
            'view_b2b_pricing',        // Access to wholesale-tier pricing
            'request_quotes',          // Submit and track bulk quote requests
            'manage_own_profile',      // Own profile + tax/resale certificates

            // ── Retail Customer Permissions ──────────────────
            'view_own_orders',         // Already defined above (shared)
            'manage_wishlist',         // Add/remove wishlist items
            'book_appointments',       // Concierge / showroom appointments
        ];

        // Create all permissions (idempotent via firstOrCreate)
        foreach (array_unique($permissions) as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        // ─────────────────────────────────────────────────────
        // 2. Define roles and map their permission sets
        // ─────────────────────────────────────────────────────

        /**
         * SUPER ADMIN
         * Gets NO explicit permissions — bypasses all checks via Gate::before().
         * This is the cleanest pattern: the audit log can distinguish between
         * "user had permission X" vs "user bypassed as Super Admin".
         */
        $superAdmin = Role::firstOrCreate(['name' => 'Super Admin', 'guard_name' => 'web']);
        // Intentionally empty — Gate::before() handles this

        /**
         * ADMIN
         * Gets a configurable subset of admin-level permissions.
         * In production, individual Admin users can have permissions further
         * restricted via direct user-level permission revocation.
         */
        $admin = Role::firstOrCreate(['name' => 'Admin', 'guard_name' => 'web']);
        $admin->syncPermissions([
            'view_admin_dashboard',
            'manage_diamonds',
            'manage_products',
            'manage_categories',
            'products.view',
            'products.create_edit',
            'products.edit_price',
            'products.publish',
            'inventory.manage',
            'categories.manage',
            'collections.manage',
            'media.view',
            'media.upload',
            'seo.manage',
            'manage_orders',
            'view_reports',
            // NOTE: 'manage_users' and 'manage_settings' deliberately excluded.
            // Only Super Admin (via Gate bypass) can manage users and settings.
        ]);

        /**
         * PARTNER (Vendor)
         * Scoped to their own data only. Cannot see other vendors' inventory,
         * total platform revenue, or any admin functionality.
         */
        $partner = Role::firstOrCreate(['name' => 'Partner', 'guard_name' => 'web']);
        $partner->syncPermissions([
            'manage_own_diamonds',
            'view_own_orders',
            'update_own_profile',
        ]);

        /**
         * WHOLESALE BUYER
         * B2B customer with access to bulk ordering tools and wholesale pricing.
         * Cannot access any admin or partner functionality.
         */
        $wholesale = Role::firstOrCreate(['name' => 'Wholesale Buyer', 'guard_name' => 'web']);
        $wholesale->syncPermissions([
            'place_bulk_orders',
            'view_b2b_pricing',
            'request_quotes',
            'manage_own_profile',
            'view_own_orders',
        ]);

        /**
         * RETAIL CUSTOMER
         * Standard B2C customer. Minimal permissions — order tracking,
         * wishlist management, and appointment booking.
         */
        $retail = Role::firstOrCreate(['name' => 'Retail Customer', 'guard_name' => 'web']);
        $retail->syncPermissions([
            'view_own_orders',
            'manage_wishlist',
            'book_appointments',
            'manage_own_profile',
        ]);
    }
}
