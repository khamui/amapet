import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { environment } from 'src/environments/environment';

export interface BackupInfo {
  name: string;
  createdAt: string;
}

interface CanSeedResponse {
  canSeed: boolean;
}

interface SeedResponse {
  message: string;
}

interface BackupResponse {
  backupName: string;
}

interface BackupsListResponse {
  backups: BackupInfo[];
}

interface RestoreResponse {
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private api = inject(ApiService);

  public canSeed = signal<boolean>(false);
  public backups = signal<BackupInfo[]>([]);
  public isLoading = signal<boolean>(false);

  async checkCanSeed(): Promise<void> {
    const { isError, result } = await this.api.read<CanSeedResponse>(
      '/database/can-seed',
      true
    );
    if (!isError) {
      this.canSeed.set(result.canSeed);
    }
  }

  async seed(): Promise<boolean> {
    this.isLoading.set(true);
    try {
      const { isError } = await this.api.create(
        '/database/seed',
        {},
        true
      );
      if (!isError) {
        this.canSeed.set(false);
      }
      return !isError;
    } finally {
      this.isLoading.set(false);
    }
  }

  async loadBackups(): Promise<void> {
    const { isError, result } = await this.api.read<BackupsListResponse>(
      '/database/backups',
      true
    );
    if (!isError) {
      this.backups.set(result.backups);
    }
  }

  async createBackup(): Promise<string | null> {
    this.isLoading.set(true);
    try {
      const { isError, result } = await this.api.create(
        '/database/backup',
        {},
        true
      );
      if (!isError) {
        await this.loadBackups();
        return (result as BackupResponse).backupName;
      }
      return null;
    } finally {
      this.isLoading.set(false);
    }
  }

  async restore(backupName: string): Promise<boolean> {
    this.isLoading.set(true);
    try {
      const { isError } = await this.api.create(
        '/database/restore',
        { backupName },
        true
      );
      return !isError;
    } finally {
      this.isLoading.set(false);
    }
  }

  downloadBackup(backupName: string): void {
    const token = localStorage.getItem('amapet_token');
    const url = `${environment.apiUrl}/database/backups/${encodeURIComponent(backupName)}/download`;

    // Create a temporary link and click it to trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = backupName;

    // Add auth token as query param for download (since we can't set headers on link click)
    // Alternative: open in new window with token
    const authUrl = `${url}?token=${token}`;

    // Use fetch to download with auth header, then create blob URL
    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error('Download failed');
        return response.blob();
      })
      .then((blob) => {
        const blobUrl = window.URL.createObjectURL(blob);
        link.href = blobUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      })
      .catch((error) => {
        console.error('Download failed:', error);
      });
  }
}
