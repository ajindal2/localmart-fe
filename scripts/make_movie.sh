#!/bin/sh
# Usage: make_movie.sh <img_1> <img_2> out.mp4
ffmpeg \
-loop 1 -t 1 -i $1 \
-loop 1 -t 2 -i $2 \
-loop 1 -t 1 -i $1 \
-filter_complex \
"[0]scale=-1:1080[src];[1]scale=-1:1080,format=yuva444p,fade=d=1:t=in:alpha=1,setpts=PTS-STARTPTS+4/TB[f0]; \
 [2]scale=-1:1080,format=yuva444p,fade=d=1:t=in:alpha=1,setpts=PTS-STARTPTS+8/TB[f1]; \
 [src][f0]overlay[bg1];[bg1][f1]overlay,format=yuv420p[v]" -map "[v]" -movflags +faststart  -crf 17  $3
