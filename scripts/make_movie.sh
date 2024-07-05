#!/bin/sh
# Usage: make_movie.sh <img_1> <img_2> <img_3> out.mp4
ffmpeg \
-loop 1 -t 1 -i $1 \
-loop 1 -t 2 -i $2 \
-loop 1 -t 2 -i $3 \
-loop 1 -t 1 -i $1 \
-filter_complex \
"[0]scale=-1:1080[src];[1]scale=-1:1080,format=yuva444p,fade=d=1:t=in:alpha=1,setpts=PTS-STARTPTS+2/TB[f0]; \
 [2]scale=-1:1080,format=yuva444p,fade=d=1:t=in:alpha=1,setpts=PTS-STARTPTS+5/TB[f1]; \
 [3]scale=-1:1080,format=yuva444p,fade=d=1:t=in:alpha=1,setpts=PTS-STARTPTS+8/TB[f2]; \
 [src][f0]overlay[bg1];[bg1][f1]overlay[bg2];[bg2][f2]overlay,format=yuv420p[v]" -map "[v]" -movflags +faststart  -crf 17  $4
