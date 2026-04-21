<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function index()
    {
        return response()->json(SiteSetting::all());
    }

    public function show($key)
    {
        $setting = SiteSetting::where('key', $key)->firstOrFail();
        return response()->json($setting);
    }

    public function update(Request $request, $key)
    {
        $validated = $request->validate([
            'value' => 'nullable|string',
            'type' => 'nullable|string',
            'group' => 'nullable|string',
        ]);

        $setting = SiteSetting::updateOrCreate(
            ['key' => $key],
            $validated
        );

        return response()->json($setting);
    }

    public function bulkUpdate(Request $request)
    {
        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|string',
            'settings.*.value' => 'nullable|string',
        ]);

        foreach ($request->settings as $settingData) {
            SiteSetting::updateOrCreate(
                ['key' => $settingData['key']],
                ['value' => $settingData['value']]
            );
        }

        return response()->json(['message' => 'Settings updated successfully']);
    }

    public function publicIndex()
    {
        $settings = SiteSetting::whereIn('group', ['general', 'seo', 'appearance'])
            ->pluck('value', 'key');
        return response()->json($settings);
    }
}
