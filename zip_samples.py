#!/usr/bin/python
#
# Copyright (C) 2010 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.


__author__ = 'ericbidelman@chromium.org (Eric Bidelman)'

import os
import zipfile

SAMPLES_DIR = 'samples'

def dir_entries(dir_name):
  files = os.walk(dir_name)
  l = []
  for root, currdir, file_list in files:
    # Filter out .svn directories.
    if not '.svn' in root:
      # filter out video assets.
      l.extend('%s/%s' % (root, f)  for f in file_list if not f.startswith('.') and not f.endswith(('.mp4', '.webm', '.ogv')))
  return l

def zip_samples(samples_dir):
  for sample in os.listdir(samples_dir):
    # Filter out .svn directories.
    if not sample.startswith('.'):
      base_path = '%s/%s' % (SAMPLES_DIR, sample)

      if not os.path.isdir(base_path):
        continue

      file_name = '%s/%s.zip' % (base_path, sample)

      # Delete archive if already exists before we establish the files to zip.
      if os.path.exists(file_name):
        os.remove(file_name)

      #file_list = [x for x in os.listdir(base_path) if not x.startswith('.')]
      file_list = dir_entries(base_path)

      # Create new .zip file.
      print '= Creating archive:', file_name
      fp = zipfile.ZipFile(file_name, 'w')

      # Add each file in sample dir to archive.
      for f in file_list:
        print '\tadding', f
        fp.write(f)

      fp.close()

if __name__ == '__main__':
  zip_samples(SAMPLES_DIR)

