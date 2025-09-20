# ICGS Photo Gallery - Automatic Slideshow

## 🎉 **Super Easy Photo Management!**

Just drop your photos in this folder and the slideshow will automatically include them!

## How to Add Photos

1. **Just Drop & Go**: Put any JPG or PNG files directly in this folder
2. **Automatic Detection**: The slideshow will automatically find and loop through all your photos
3. **Smart Naming**: Use these filename patterns for automatic categorization:

### Recommended File Names (for auto-categorization):
- `tournament-group-photo-1.jpg`, `tournament-group-photo-2.jpg`, etc.
- `awards-ceremony-1.jpg`, `awards-ceremony-2.jpg`, etc.  
- `course-action-1.jpg`, `player-action-1.jpg`, etc.
- `social-gathering-1.jpg`, `tournament-dinner-1.jpg`, etc.
- `sponsors-recognition-1.jpg`
- `celebration-1.jpg`, `celebration-2.jpg`, etc.
- `course-scenery-1.jpg`, `course-scenery-2.jpg`, etc.

## What Happens Automatically

✅ **Auto-Detection**: System scans for up to 20+ common photo names  
✅ **Auto-Loop**: Slideshow continuously cycles through all found photos  
✅ **Auto-Categorization**: Photos are automatically labeled based on filename  
✅ **Auto-Description**: Smart descriptions generated from photo names  
✅ **Error-Safe**: Missing photos are automatically skipped  

## Simple Structure

```
photos/
├── tournament-group-photo-1.jpg    ← Auto-detected
├── tournament-group-photo-2.jpg    ← Auto-detected  
├── awards-ceremony-1.jpg          ← Auto-detected
├── course-action-1.jpg            ← Auto-detected
├── social-gathering-1.jpg         ← Auto-detected
├── your-custom-photo.jpg          ← Will be skipped (not in auto-list)
└── celebration-1.jpg              ← Auto-detected
```

## Photo Requirements

- **Resolution**: Minimum 1920x1080 for good display quality
- **File Size**: Keep individual files under 5MB for good web performance
- **Aspect Ratio**: 16:9 or 4:3 work best for the slideshow display

## No More Manual Updates Needed!

🎉 **The old days of manually editing code are over!**

Just name your photos using the recommended patterns above and drop them in this folder. The slideshow will automatically:
- Detect your photos
- Loop through them continuously  
- Generate appropriate titles and descriptions
- Skip any missing files gracefully

## Want to Add More Photo Types?

If you have photos that don't fit the standard naming patterns, you can easily add more patterns by editing the `photoFilenames` array in:
`src/components/Gallery/PhotoGallery.tsx`

## Example: Adding Custom Photo Types

```typescript
// Add these to the photoFilenames array:
'sponsors-dinner-1.jpg',
'golf-lessons-1.jpg', 
'practice-range-1.jpg',
// etc...
```