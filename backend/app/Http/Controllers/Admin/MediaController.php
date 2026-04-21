<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MediaController extends Controller
{
    public function index()
    {
        return response()->json(Media::latest()->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:jpeg,png,jpg,gif,svg,webp,mp4,pdf|max:10240',
        ]);

        $file = $request->file('file');
        $path = $file->store('public/media');

        $media = Media::create([
            'file_name' => $file->getClientOriginalName(),
            'file_path' => Storage::url($path),
            'mime_type' => $file->getClientMimeType(),
            'size' => $file->getSize(),
        ]);

        return response()->json($media, 201);
    }

    public function update(Request $request, Media $media)
    {
        $validated = $request->validate([
            'alt_text' => 'nullable|string|max:255',
        ]);

        $media->update($validated);
        return response()->json($media);
    }

    public function destroy(Media $media)
    {
        $relativePath = str_replace('/storage/', '', $media->file_path);
        Storage::disk('public')->delete($relativePath);

        $media->delete();
        return response()->json(null, 204);
    }
}
