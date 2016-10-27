# flow with visuals

##### finish.dialog.html
ng-click="vm.renderMovie(vm.subs)"

##### subtitles.controller.js
renderMovie(clips) {
    this.templater.renderMovie(subs, visuals, this.meta, this.projectId)

##### templater.service.js
renderMovie(subs, visuals, meta, projectId) {
    this.visualsToJSON(visuals, subs, meta, uniqueProjectName),
        this.overlays(newClips, meta, project, subs)

# flow upload HIGHRES - Receive LOWRES
POST /upload-to-dropbox
    files is saved in temp (multiparty.Form) (onder unieke filenaam)
        save HIGH to dropbox: uploadHiRes(file.path, dbPath); 
            get metadata outof file sith FFprobe
                make small with ffmpeg && save it in temp
                    save LOW to dropbox:
                        remove ASS/LOW/HIGH


# FASE 1
1. bugs
2. logica uit view halen
3. ng-include herbekijken
4. New / Open scheiden
5. styling
6. dropbox uitschakelen op templater
7. dropbox uitschakelen op server
8. template-data in database 
9. projectnaam ipv 202606_081936_joriscompernol.mp4
10. email als klaar, ook bij visuals

# FASE 2
1. ng1.5.0 to NG2
2. remove legacy code on server
3. 

# FASE 3
1. refactor other tools to NG2 project



- Templater listen to URL test
- Authenticatie apart ?
- Mongodb ? https://www.slant.co/versus/14255/613/~firebase_vs_mongodb
