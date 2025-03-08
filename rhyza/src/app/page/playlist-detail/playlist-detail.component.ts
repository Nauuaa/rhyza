import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AsyncPipe, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { PlaylistModel } from '../../models/playlist.model';
import { SongModel } from '../../models/song.model';
import { PlaylistState } from '../../ngrx/playlist/playlist.state';
import * as PlaylistActions from '../../ngrx/playlist/playlist.actions';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { MusicTabComponent } from '../../shared/components/music-tab/music-tab.component';
import { MatIcon } from '@angular/material/icon';
import * as SongActions from '../../ngrx/song/song.actions';
import { PlaylistService } from '../../services/playlist/playlist.service'; // Import service để upload ảnh

@Component({
  selector: 'app-playlist-detail',
  templateUrl: './playlist-detail.component.html',
  standalone: true,
  imports: [AsyncPipe, LoadingComponent, MusicTabComponent, MatIcon],
  styleUrls: ['./playlist-detail.component.scss']
})
export class PlaylistDetailComponent implements OnInit, OnDestroy {
  songListPlaylist: SongModel[] = [];
  songListPlaylist$: Observable<SongModel[]>;
  playlistDetail$: Observable<PlaylistModel>;
  playlistDetail!: PlaylistModel;
  subscriptions: Subscription[] = [];
  isLoadingPlaylistDetail$: Observable<boolean>;
  isLoadingSongListPlaylist$: Observable<boolean>;

  @ViewChild('fileInput') fileInput!: ElementRef; // Thêm ViewChild để truy cập file input

  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private store: Store<{ playlist: PlaylistState }>,
  ) {
    this.playlistDetail$ = this.store.select((state) => state.playlist.playlistDetail);
    this.isLoadingPlaylistDetail$ = this.store.select((state) => state.playlist.isLoadingDetail);
    this.songListPlaylist$ = this.store.select((state) => state.playlist.songList);
    this.isLoadingSongListPlaylist$ = this.store.select((state) => state.playlist.isLoading);
  }

  goBack() {
    this.location.back();
  }





  ngOnInit() {
    this.subscriptions.push(
      this.activatedRoute.params.subscribe((params) => {
        const id = params['id'];
        if (id) {
          console.log('Playlist ID:', id); // Log để kiểm tra ID
          this.store.dispatch(PlaylistActions.getPlaylistById({ id, idToken: 'your-id-token' }));
          this.store.dispatch(SongActions.getSongsByPlaylist({ playlistId: id, idToken: 'your-id-token' }));
        }
      }),

      this.songListPlaylist$.subscribe((songList) => {
        if (songList.length > 0) { // Kiểm tra nếu songList có dữ liệu
          this.songListPlaylist = songList;
          console.log('Song List Playlist:', this.songListPlaylist); // Log để kiểm tra dữ liệu
        }
      }),

      this.playlistDetail$.subscribe((playlistDetail) => {
        if (playlistDetail) { // Kiểm tra nếu playlistDetail có dữ liệu
          this.playlistDetail = playlistDetail;
          console.log('Playlist Detail:', this.playlistDetail); // Log để kiểm tra dữ liệu
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.store.dispatch(PlaylistActions.clearPlaylistDetail());
  }
}
