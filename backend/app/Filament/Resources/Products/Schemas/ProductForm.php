<?php

namespace App\Filament\Resources\Products\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ProductForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('sku')
                    ->label('SKU')
                    ->required(),
                TextInput::make('name')
                    ->required(),
                TextInput::make('slug')
                    ->required(),
                Select::make('product_type')
                    ->options([
                        'diamond' => 'Diamond',
                        'jewelry' => 'Jewelry',
                        'high_jewelry' => 'High Jewelry',
                        'custom' => 'Custom',
                    ])
                    ->default('jewelry')
                    ->required(),
                Select::make('status')
                    ->options([
                        'draft' => 'Draft',
                        'pending_review' => 'Pending Review',
                        'published' => 'Published',
                        'archived' => 'Archived',
                    ])
                    ->default('published')
                    ->required(),
                Select::make('visibility')
                    ->options([
                        'public' => 'Public',
                        'hidden' => 'Hidden',
                        'b2b_only' => 'B2B Only',
                        'partner_only' => 'Partner Only',
                    ])
                    ->default('public')
                    ->required(),
                DateTimePicker::make('published_at'),
                Textarea::make('description')
                    ->columnSpanFull(),
                TextInput::make('meta_title'),
                Textarea::make('meta_description')
                    ->columnSpanFull(),
                TextInput::make('canonical_url')
                    ->url(),
                Select::make('category_id')
                    ->relationship('category', 'name')
                    ->searchable()
                    ->preload()
                    ->label('Primary Category'),
                TextInput::make('base_price')
                    ->required()
                    ->numeric()
                    ->prefix('$'),
                TextInput::make('compare_at_price')
                    ->numeric()
                    ->prefix('$'),
                TextInput::make('currency')
                    ->default('USD')
                    ->maxLength(3),
                Select::make('inventory_status')
                    ->options([
                        'in_stock' => 'In Stock',
                        'made_to_order' => 'Made to Order',
                        'sold_out' => 'Sold Out',
                    ])
                    ->default('in_stock')
                    ->required(),
                TextInput::make('stock_quantity')
                    ->numeric()
                    ->default(1),
                TextInput::make('brand'),
                TextInput::make('collection_name'),
                TextInput::make('gender'),
                TextInput::make('occasion'),
                TagsInput::make('tags')
                    ->separator(','),
                \Filament\Forms\Components\KeyValue::make('attributes')
                    ->keyLabel('Attribute Name')
                    ->valueLabel('Attribute Value')
                    ->columnSpanFull(),
                Toggle::make('featured'),
                Toggle::make('manual_placement')
                    ->helperText('Disable automatic category and collection placement for this product.'),
                Toggle::make('is_active')
                    ->required(),

                // ── Cloudinary Media Upload ──────────────────────────────────
                Section::make('Product Media (Cloudinary)')
                    ->description('Upload product images and videos. All files are stored on Cloudinary.')
                    ->schema([
                        FileUpload::make('_cloudinary_images_upload')
                            ->label('Product Images')
                            ->disk('public')
                            ->directory('tmp-cloudinary')
                            ->image()
                            ->multiple()
                            ->reorderable()
                            ->appendFiles()
                            ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
                            ->helperText('JPEG, PNG, WEBP or GIF.')
                            ->columnSpanFull(),

                        FileUpload::make('_cloudinary_videos_upload')
                            ->label('Product Videos')
                            ->disk('public')
                            ->directory('tmp-cloudinary')
                            ->multiple()
                            ->reorderable()
                            ->appendFiles()
                            // PHP's finfo can report mp4 files as video/x-m4v, video/mp4, or video/quicktime.
                            // We include all common aliases so validation passes regardless of detection.
                            ->acceptedFileTypes([
                                'video/mp4',
                                'video/x-m4v',
                                'video/webm',
                                'video/ogg',
                                'video/quicktime',
                                'video/x-msvideo',
                                'video/x-matroska',
                            ])
                            ->rules(['mimetypes:video/mp4,video/x-m4v,video/webm,video/ogg,video/quicktime,video/x-msvideo,video/x-matroska'])
                            ->helperText('MP4, WEBM, MOV, AVI or MKV.')
                            ->columnSpanFull(),
                    ])
                    ->columnSpanFull(),
                // ────────────────────────────────────────────────────────────
            ]);
    }
}
