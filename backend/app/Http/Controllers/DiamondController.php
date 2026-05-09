<?php

namespace App\Http\Controllers;

use App\Models\Diamond;
use Illuminate\Http\Request;

class DiamondController extends Controller
{
    public function index()
    {
        return response()->json(Diamond::with('vendor')->paginate(15));
    }

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
            'specs' => 'array',
            'video_url' => 'nullable|url',
            'image_url' => 'nullable|url',
            'image_urls' => 'nullable|array',
            'image_urls.*' => 'string',
            'is_available' => 'boolean',
            'vendor_id' => 'required|exists:users,id',
        ]);

        $diamond = Diamond::create($validated);
        return response()->json($diamond, 201);
    }

    public function show(Diamond $diamond)
    {
        return response()->json($diamond->load('vendor'));
    }

    public function update(Request $request, Diamond $diamond)
    {
        $validated = $request->validate([
            'certificate_number' => 'string|unique:diamonds,certificate_number,' . $diamond->id,
            'lab' => 'string',
            'carat' => 'numeric|min:0',
            'color' => 'string',
            'clarity' => 'string',
            'cut' => 'nullable|string',
            'shape' => 'string',
            'price' => 'numeric|min:0',
            'specs' => 'array',
            'video_url' => 'nullable|url',
            'image_url' => 'nullable|url',
            'image_urls' => 'nullable|array',
            'image_urls.*' => 'string',
            'is_available' => 'boolean',
            'vendor_id' => 'exists:users,id',
        ]);

        $diamond->update($validated);
        return response()->json($diamond);
    }

    public function destroy(Diamond $diamond)
    {
        $diamond->delete();
        return response()->json(null, 204);
    }
}
