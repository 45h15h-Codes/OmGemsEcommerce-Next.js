<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PageController extends Controller
{
    public function index()
    {
        return response()->json(Page::latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'string|unique:pages,slug',
            'content_sections' => 'nullable|array',
            'status' => 'in:draft,published',
            'seo_title' => 'nullable|string',
            'seo_description' => 'nullable|string',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $page = Page::create($validated);
        return response()->json($page, 201);
    }

    public function show(Page $page)
    {
        return response()->json($page);
    }

    public function update(Request $request, Page $page)
    {
        $validated = $request->validate([
            'title' => 'string|max:255',
            'slug' => 'string|unique:pages,slug,' . $page->id,
            'content_sections' => 'nullable|array',
            'status' => 'in:draft,published',
            'seo_title' => 'nullable|string',
            'seo_description' => 'nullable|string',
        ]);

        $page->update($validated);
        return response()->json($page);
    }

    public function destroy(Page $page)
    {
        $page->delete();
        return response()->json(null, 204);
    }

    public function publicShow($slug)
    {
        $page = Page::where('slug', $slug)
            ->where('status', 'published')
            ->firstOrFail();

        return response()->json($page);
    }
}
