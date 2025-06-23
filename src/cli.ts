#!/usr/bin/env node
import { help, run } from 'clide-js';

run({
  plugins: [
    help({
      helpFlags: ['help'],
      maxWidth: 120,
    }),
  ],
  defaultCommand: 'css',
});
