#!/bin/bash
INPUT="$1"
OUTPUT_FILE="$2"
FRAME_COUNT="$3"
OUTPUT_DIR="/Users/viktorr/RiderProjects/ContinuumCore/temp_frames_final"

echo "Creating temp directory..."
mkdir -p "$OUTPUT_DIR"
rm -f "$OUTPUT_DIR"/*.png

echo "Extracting $FRAME_COUNT frames and converting to PNG..."
for i in $(seq 1 $FRAME_COUNT)
do
  webpmux -get frame $i "$INPUT" -o "$OUTPUT_DIR/f.webp" > /dev/null 2>&1 || break
  dwebp "$OUTPUT_DIR/f.webp" -o "$OUTPUT_DIR/f_$i.png" > /dev/null 2>&1
  if (( $i % 100 == 0 )); then echo "Processed $i / $FRAME_COUNT frames..."; fi
done

rm -f "$OUTPUT_DIR/f.webp"

echo "Combining PNGs into MP4 for QuickTime..."
# Use 10fps for slow walkthrough if it feels too fast, or keep 25 if timestamps were real.
# But subagent pauses were real-time, so 25fps should match the capture rate.
ffmpeg -y -framerate 25 -i "$OUTPUT_DIR/f_%d.png" -c:v libx264 -pix_fmt yuv420p -profile:v high -level 4.1 -crf 18 -movflags +faststart "$OUTPUT_FILE"

echo "Cleaning up..."
rm -rf "$OUTPUT_DIR"
echo "Done! Saved to $OUTPUT_FILE"
