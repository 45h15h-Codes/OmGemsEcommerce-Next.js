<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NavLink;
use Illuminate\Http\Request;

class NavLinkController extends Controller
{
    public function index()
    {
        return response()->json(NavLink::orderBy('order_index')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'label' => 'required|string|max:255',
            'url' => 'required|string|max:255',
            'location' => 'required|in:header,footer',
            'order_index' => 'integer',
            'is_active' => 'boolean',
        ]);

        $navLink = NavLink::create($validated);
        return response()->json($navLink, 201);
    }

    public function update(Request $request, NavLink $navLink)
    {
        $validated = $request->validate([
            'label' => 'string|max:255',
            'url' => 'string|max:255',
            'location' => 'in:header,footer',
            'order_index' => 'integer',
            'is_active' => 'boolean',
        ]);

        $navLink->update($validated);
        return response()->json($navLink);
    }

    public function destroy(NavLink $navLink)
    {
        $navLink->delete();
        return response()->json(null, 204);
    }

    public function reorder(Request $request)
    {
        $validated = $request->validate([
            'ordered_ids' => 'required|array',
            'ordered_ids.*' => 'integer|exists:nav_links,id',
        ]);

        foreach ($validated['ordered_ids'] as $index => $id) {
            NavLink::where('id', $id)->update(['order_index' => $index]);
        }

        return response()->json(['message' => 'Reordered successfully']);
    }

    public function publicIndex()
    {
        $links = NavLink::where('is_active', true)
            ->orderBy('order_index')
            ->get()
            ->groupBy('location');
        return response()->json($links);
    }
}
