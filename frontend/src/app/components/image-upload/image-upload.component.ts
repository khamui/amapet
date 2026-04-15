import {
  Component,
  computed,
  inject,
  input,
  output,
  PLATFORM_ID,
  signal,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';

export interface ImageUploadState {
  files: File[];
  existingUrls: string[];
}

interface ImageItem {
  id: string;
  preview: string;
  type: 'file' | 'existing';
  file?: File;
  url?: string;
}

@Component({
  selector: 'ama-image-upload',
  templateUrl: './image-upload.component.html',
  standalone: true,
  imports: [FileUploadModule, ButtonModule],
})
export class ImageUploadComponent {
  existingImages = input<string[]>([]);
  imagesChanged = output<ImageUploadState>();

  private platformId = inject(PLATFORM_ID);
  private fileUploadRef = viewChild<FileUpload>('fileUploadRef');
  private newFiles = signal<{ id: string; file: File; preview: string }[]>([]);
  private removedExisting = signal<Set<string>>(new Set());

  get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  keptExisting = computed(() => {
    const removed = this.removedExisting();
    return this.existingImages().filter((url) => !removed.has(url));
  });

  allImages = computed<ImageItem[]>(() => {
    const existing: ImageItem[] = this.keptExisting().map((url) => ({
      id: url,
      preview: url,
      type: 'existing' as const,
      url,
    }));
    const newOnes: ImageItem[] = this.newFiles().map((f) => ({
      id: f.id,
      preview: f.preview,
      type: 'file' as const,
      file: f.file,
    }));
    return [...existing, ...newOnes];
  });

  totalCount = computed(() => this.allImages().length);
  canAddMore = computed(() => this.totalCount() < 5);

  onFilesSelected(event: { currentFiles: File[] }) {
    const files = event.currentFiles;
    if (!files?.length) return;

    const remaining = 5 - this.totalCount();
    const toAdd = files.slice(0, remaining);

    const newEntries = toAdd.map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
    }));

    this.newFiles.update((current) => [...current, ...newEntries]);
    this.fileUploadRef()?.clear();
    this.emitChange();
  }

  removeImage(id: string) {
    const item = this.allImages().find((img) => img.id === id);
    if (!item) return;

    if (item.type === 'existing') {
      this.removedExisting.update((set) => {
        const next = new Set(set);
        next.add(item.url!);
        return next;
      });
    } else {
      // Revoke object URL to free memory
      const entry = this.newFiles().find((f) => f.id === id);
      if (entry) URL.revokeObjectURL(entry.preview);
      this.newFiles.update((current) => current.filter((f) => f.id !== id));
    }
    this.emitChange();
  }

  private emitChange() {
    this.imagesChanged.emit({
      files: this.newFiles().map((f) => f.file),
      existingUrls: this.keptExisting(),
    });
  }
}
