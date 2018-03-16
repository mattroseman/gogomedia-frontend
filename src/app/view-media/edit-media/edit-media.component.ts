import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { MarkdownService } from 'angular2-markdown';

import { Media } from '../../media';

@Component({
  selector: 'app-edit-media',
  templateUrl: './edit-media.component.html',
  styleUrls: ['./edit-media.component.scss'],
  providers: [MatIconRegistry]
})
export class EditMediaComponent implements OnInit {
  editDescription: boolean;

  constructor(
    public dialogRef: MatDialogRef<EditMediaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Media,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private _markdown: MarkdownService
  ) {
    this.editDescription = data.description == "";
    this.registerIcons();
  }

  ngOnInit() {
    // change the behavior of markdown generator to include target='_blank' to open links in a new tab/window
    // the rel='noopener noreferrer' is a countermeasure to a specific attack when opening cross origin sites in a new tab
    // see this link https://mathiasbynens.github.io/rel-noopener/
    // TODO consider this link, and see if it makes more sense to use defualt link behavior
    // https://css-tricks.com/use-target_blank/
    this._markdown.renderer.link = (href: string, title: string, text: string) => {
      return `<a href=${href} target='_blank' rel='noopener noreferrer'>${text}</a>`
    };
    this._markdown.setMarkedOptions({
      gfm: true,
      breaks: true
    });
  }

  registerIcons(): void {
    this.iconRegistry.addSvgIcon('edit', this.sanitizer.bypassSecurityTrustResourceUrl('/assets/edit_icon.svg'))
    this.iconRegistry.addSvgIcon('preview', this.sanitizer.bypassSecurityTrustResourceUrl('/assets/preview_icon.svg'))
  }

  onClose() {
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
