<?php

namespace App\Http\Controllers\Partner;

use App\Http\Controllers\Controller;
use App\Models\Diamond;
use Illuminate\Http\Request;

class PartnerDiamondController extends Controller
{
    /**
     * GET /api/partner/diamonds
     *
     * List all diamonds belonging to the authenticated vendor.
     * Supports optional search and status filters.
     */
    public function index(Request $request)
    {
        $query = Diamond::where('vendor_id', $request->user()->id);

        // Optional search by certificate number or shape
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('certificate_number', 'like', "%{$search}%")
                  ->orWhere('shape', 'like', "%{$search}%")
                  ->orWhere('color', 'like', "%{$search}%")
                  ->orWhere('clarity', 'like', "%{$search}%");
            });
        }

        // Optional availability filter
        if ($request->has('is_available')) {
            $query->where('is_available', $request->boolean('is_available'));
        }

        // Sort
        $sortBy = $request->input('sort_by', 'created_at');
        $sortDir = $request->input('sort_dir', 'desc');
        $allowedSorts = ['created_at', 'price', 'carat', 'shape', 'color', 'clarity'];
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortDir === 'asc' ? 'asc' : 'desc');
        }

        return response()->json($query->paginate(15));
    }

    /**
     * POST /api/partner/diamonds
     *
     * Create a new diamond listing. Automatically sets vendor_id to the authenticated user.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'certificate_number' => 'required|string|unique:diamonds',
            'lab' => 'required|string',
            'carat' => 'required|numeric|min:0',
            'color' => 'required|string',
            'clarity' => 'required|string',
            'cut' => 'nullable|string',
            'shape' => 'required|string',
            'price' => 'required|numeric|min:0',
            'specs' => 'nullable|array',
            'video_url' => 'nullable|url',
            'image_url' => 'nullable|url',
            'is_available' => 'boolean',
        ]);

        // Force vendor_id to be the authenticated user
        $validated['vendor_id'] = $request->user()->id;

        $diamond = Diamond::create($validated);
        return response()->json($diamond, 201);
    }

    /**
     * GET /api/partner/diamonds/{id}
     *
     * Show a single diamond — only if it belongs to the authenticated vendor.
     */
    public function show(Request $request, string $id)
    {
        $diamond = Diamond::where('vendor_id', $request->user()->id)->findOrFail($id);
        return response()->json($diamond);
    }

    /**
     * PUT /api/partner/diamonds/{id}
     *
     * Update a diamond listing — only if it belongs to the authenticated vendor.
     */
    public function update(Request $request, string $id)
    {
        $diamond = Diamond::where('vendor_id', $request->user()->id)->findOrFail($id);

        $validated = $request->validate([
            'certificate_number' => 'string|unique:diamonds,certificate_number,' . $diamond->id,
            'lab' => 'string',
            'carat' => 'numeric|min:0',
            'color' => 'string',
            'clarity' => 'string',
            'cut' => 'nullable|string',
            'shape' => 'string',
            'price' => 'numeric|min:0',
            'specs' => 'nullable|array',
            'video_url' => 'nullable|url',
            'image_url' => 'nullable|url',
            'is_available' => 'boolean',
        ]);

        // Prevent vendor_id override
        unset($validated['vendor_id']);

        $diamond->update($validated);
        return response()->json($diamond);
    }

    /**
     * DELETE /api/partner/diamonds/{id}
     *
     * Soft-delete a diamond — only if it belongs to the authenticated vendor.
     */
    public function destroy(Request $request, string $id)
    {
        $diamond = Diamond::where('vendor_id', $request->user()->id)->findOrFail($id);
        $diamond->delete();
        return response()->json(['message' => 'Diamond deleted successfully.']);
    }

    /**
     * PATCH /api/partner/diamonds/{id}/toggle
     *
     * Toggle the availability status of a diamond.
     */
    public function toggleAvailability(Request $request, string $id)
    {
        $diamond = Diamond::where('vendor_id', $request->user()->id)->findOrFail($id);
        $diamond->is_available = !$diamond->is_available;
        $diamond->save();

        return response()->json([
            'message' => 'Availability toggled successfully.',
            'is_available' => $diamond->is_available,
        ]);
    }
}
