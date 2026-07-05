export type FileNode = { type: 'file'; content: string };
export type DirNode = { type: 'dir'; contents: Record<string, FileNode | DirNode> };
export type FSNode = FileNode | DirNode;

export const defaultVFS: DirNode = {
  type: 'dir',
  contents: {
    bin: { type: 'dir', contents: {} },
    etc: { type: 'dir', contents: {} },
    home: {
      type: 'dir',
      contents: {
        guest: {
          type: 'dir',
          contents: {
            'about.txt': { type: 'file', content: 'Full Stack & UI/UX Engineer with a passion for building interactive digital experiences.' },
            'contact.txt': { type: 'file', content: 'Email: hello@prajwal.dev\nLocation: Earth' },
            'resume.pdf': { type: 'file', content: '[PDF Binary - Use "resume" command to download]' },
            Projects: {
              type: 'dir',
              contents: {
                'project1.md': { type: 'file', content: '# Project 1\nA cool project I worked on.' }
              }
            },
            Skills: {
              type: 'dir',
              contents: {
                'frontend.txt': { type: 'file', content: 'React, Next.js, TailwindCSS, Framer Motion' },
                'backend.txt': { type: 'file', content: 'Node.js, Supabase, PostgreSQL' }
              }
            }
          }
        }
      }
    },
    var: { type: 'dir', contents: {} },
    tmp: { type: 'dir', contents: {} },
    secret: { type: 'dir', contents: { 'access.log': { type: 'file', content: 'Access denied.' } } }
  }
};

export class VirtualFileSystem {
  private root: DirNode;
  private cwd: string;

  constructor(initialState = defaultVFS) {
    this.root = initialState;
    this.cwd = '/home/guest';
  }

  getPwd() {
    return this.cwd;
  }

  resolvePath(target: string): string {
    if (target.startsWith('/')) return this.normalize(target);
    return this.normalize(`${this.cwd}/${target}`);
  }

  private normalize(path: string): string {
    const parts = path.split('/').filter(Boolean);
    const stack: string[] = [];
    for (const p of parts) {
      if (p === '..') stack.pop();
      else if (p !== '.') stack.push(p);
    }
    return '/' + stack.join('/');
  }

  getNode(path: string): FSNode | null {
    if (path === '/') return this.root;
    const parts = path.split('/').filter(Boolean);
    let current: FSNode = this.root;
    for (const p of parts) {
      if (current.type !== 'dir') return null;
      if (!current.contents[p]) return null;
      current = current.contents[p];
    }
    return current;
  }

  changeDirectory(target: string): { success: boolean; error?: string } {
    const resolved = this.resolvePath(target);
    const node = this.getNode(resolved);
    if (!node) return { success: false, error: 'cd: no such file or directory: ' + target };
    if (node.type !== 'dir') return { success: false, error: 'cd: not a directory: ' + target };
    this.cwd = resolved;
    return { success: true };
  }

  mkdir(target: string): { success: boolean; error?: string } {
    const resolved = this.resolvePath(target);
    if (resolved === '/') return { success: false, error: 'mkdir: cannot create directory /: File exists' };
    const parts = resolved.split('/').filter(Boolean);
    const newDirName = parts.pop();
    const parentPath = '/' + parts.join('/');
    const parentNode = this.getNode(parentPath);
    if (!parentNode || parentNode.type !== 'dir') return { success: false, error: 'mkdir: cannot create directory ' + target + ': No such file or directory' };
    if (parentNode.contents[newDirName!]) return { success: false, error: 'mkdir: cannot create directory ' + target + ': File exists' };
    parentNode.contents[newDirName!] = { type: 'dir', contents: {} };
    return { success: true };
  }

  touch(target: string): { success: boolean; error?: string } {
    const resolved = this.resolvePath(target);
    if (resolved === '/') return { success: false, error: 'touch: cannot touch /: Permission denied' };
    const parts = resolved.split('/').filter(Boolean);
    const fileName = parts.pop();
    const parentPath = '/' + parts.join('/');
    const parentNode = this.getNode(parentPath);
    if (!parentNode || parentNode.type !== 'dir') return { success: false, error: 'touch: cannot touch ' + target + ': No such file or directory' };
    if (!parentNode.contents[fileName!]) {
      parentNode.contents[fileName!] = { type: 'file', content: '' };
    }
    return { success: true };
  }

  rm(target: string): { success: boolean; error?: string } {
    const resolved = this.resolvePath(target);
    if (resolved === '/') return { success: false, error: 'rm: cannot remove /: Permission denied' };
    const parts = resolved.split('/').filter(Boolean);
    const fileName = parts.pop();
    const parentPath = '/' + parts.join('/');
    const parentNode = this.getNode(parentPath);
    if (!parentNode || parentNode.type !== 'dir' || !parentNode.contents[fileName!]) return { success: false, error: 'rm: cannot remove ' + target + ': No such file or directory' };
    if (parentNode.contents[fileName!].type === 'dir') return { success: false, error: 'rm: cannot remove ' + target + ': Is a directory' };
    delete parentNode.contents[fileName!];
    return { success: true };
  }
}
