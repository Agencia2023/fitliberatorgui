module.exports = {

    EXTRA_FILES: ' -x 1 ',

    PNG_FORMAT: ' -F 2',

    TIF_FORMAT: ' -F 1 ',

    NO_VERBOSE: ' -q 1',

    DEEP_ZOOM: ' -Z 1',

    PROGRESS: ' -P 1',

    HIGH_PERFORMANCE: ' -X 1',

    HAS_UNDEFINED: ' -u 1',

    bins : b => b ? ` -B ${b}` : ''


}