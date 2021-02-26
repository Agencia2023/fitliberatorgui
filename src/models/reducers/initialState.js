const initialState = {
    oldData: [],
    shouldComponentUpdateHash: 0,
    viewer: false,
    isPreviewActive: true,
    workspace:{},
    highPerformance: Boolean(localStorage.getItem('high_quality')) ?? false,
    flipImage: false,
    markPixel: {
        undefined: true,
        white_clip: true,
        black_clip: true,
    },
    freezeSettings: false,
    loading: false,
    filePath: '',
    output_png: '',
    size: {
        width: 0,
        height: 0
    },
    cPointData: {
        x: 0, y: 0
    },
    imageSelected: null,
    imageSelectedData: {
        pngCache: null,
        undefined: null,
        statistics: null,
    },
    histogram: false,
    fitsheaders: '',
    images: [],
    parameters: {
        // -s, --stretch arg          Stretch math function (asinh,linear,pow)
        s: 'linear',
        // -k, --backgroundlevel arg   Background Level 
        k: 0,
        // -p, --peaklevel arg         Peak Level
        p: 0,
        // -S, --scaledpeaklevel arg   Scaled Peak Level
        S: 10,
        // -e                          Power parameter
        e: 1,
        // -d, --depth arg            Bit depth (16 or 32) (default: 16)
        d: 16,
        // bits

        // -I, --image arg            Image index for multi-image files (default: 1)
        I: 1,
        // -z, --plane arg            Plane index for multi-plane images (default: 1)
        z: 1,
        // -b, --blacklevel arg       Black Level (default: 0)
        b: 0,
        // -w, --whitelevel arg       White Level (default: 1)
        w: 1,
        // -f, --flip arg             Flip the image vertically (default: 1)
        f: 1,
        // -F, --outformat arg        Output format 1=tiff, 2=png (default: 1)
        F: 2,
        // -u, --undefined arg        Alpha channel for undefined values (0=black,1=transparent) (default: 0)
        u: 1
    },
    whiteLvlPicker: false,
    blackLvlPicker: false,

    show_menu_options:false,
    spaceGrab:false,
    isFirstOpen: false

}

export default initialState;
