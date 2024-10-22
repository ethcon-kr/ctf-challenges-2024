#!/bin/bash
for i in {0..10000}
do
  start=$(($i*100000))
  end=$(($start+100000))
  start=$start end=$end forge test -vvv | grep found
done