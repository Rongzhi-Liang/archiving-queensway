#!/usr/bin/env python3
"""Create a history-free public GitHub candidate without publishing it.

Only the explicit allowlist is copied. Existing export files must still match
this script's previous manifest before --refresh may replace that export.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
from datetime import datetime

PROJECT = Path(__file__).resolve().parents[1]
FILES = ["README.md", ".gitignore", ".github/workflows/pages.yml",
         "scripts/preview.py", "scripts/check-release.mjs", "scripts/prepare-github.py"]
MARKER = ".public-export.json"


def fingerprint(root):
    return {str(p.relative_to(root)): hashlib.sha256(p.read_bytes()).hexdigest()
            for p in sorted(root.rglob('*')) if p.is_file() and p.name != MARKER}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', type=Path, default=PROJECT / 'work/github-release')
    parser.add_argument('--refresh', action='store_true')
    args = parser.parse_args()
    output = args.output.resolve()
    if output == PROJECT or output in PROJECT.parents or (PROJECT in output.parents and PROJECT/'work' not in output.parents):
        parser.error('Use a directory under work/ or outside the working project.')
    node = shutil.which('node') or str(Path.home()/'.local/bin/node')
    subprocess.run([node, str(PROJECT/'scripts/check-release.mjs')], check=True)
    previous = None
    if output.exists():
        if not args.refresh or not (output/MARKER).is_file():
            parser.error('Output already exists. Use --refresh only for an unmodified generated export.')
        previous = json.loads((output/MARKER).read_text())
        if previous.get('files') != fingerprint(output):
            parser.error('Export was edited after generation. Preserve those edits before refreshing.')
    output.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix='public-export-', dir=output.parent) as temp:
        candidate = Path(temp)/'site'
        candidate.mkdir()
        for relative in FILES:
            source=PROJECT/relative
            destination=candidate/relative
            destination.parent.mkdir(parents=True,exist_ok=True)
            shutil.copy2(source,destination)
        # Never follow a symlink from the private working folder into the export.
        for path in (PROJECT/'dist').rglob('*'):
            if path.is_symlink():
                raise ValueError(f'Public asset is a symbolic link: {path.relative_to(PROJECT)}')
        shutil.copytree(PROJECT/'dist',candidate/'dist')
        manifest={'schemaVersion':1,'generatedAt':datetime.now().astimezone().isoformat(),
                  'files':fingerprint(candidate),'websiteRoot':'dist',
                  'publication':'Not published; public files only; no Git history.'}
        (candidate/MARKER).write_text(json.dumps(manifest,indent=2)+'\n')
        subprocess.run([node,str(candidate/'scripts/check-release.mjs')],check=True)
        if previous is not None:
            trash=Path.home()/'.Trash'/('Queensway_GitHub_export_'+datetime.now().strftime('%Y%m%d_%H%M%S'))
            trash.parent.mkdir(parents=True,exist_ok=True)
            if trash.exists():
                raise FileExistsError(trash)
            shutil.move(str(output),str(trash))
            print(f'Previous unmodified export moved to Trash: {trash}')
        os.replace(candidate,output)
    count=len(manifest['files'])
    print(f'Prepared {count} public files: {output}')
    print('Excluded Git history, private source records, local editor/hosting settings, and verification files.')
    print('No Git repository created, no remote configured, and nothing uploaded.')


if __name__ == '__main__':
    main()
