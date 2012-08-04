#!/bin/bash
#
# Creates a .zip file of each Studio sample in its correspsonding directory.
# 
# Note: This script should be used in place of using appcfg.py update directly
# to update the application on App Engine.
#
# Copyright 2010 Eric Bidelman <ericbidelman@chromium.org>

python zip_samples.py
appcfg.py update .
