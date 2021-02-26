import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Dropzone, { useDropzone } from 'react-dropzone'
import { PreviewLoader } from './loader/Loading'
import logo from '../assets/images/fl4.png'
import TextAnimate from './animation/TextAnimate'
import { openFile } from '../models/actions/fileActions'

Dropzone.autoDiscover = false;


const Preview = React.memo(() => {

    const output_png = useSelector(state => state.output_png)
    const loading = useSelector(state => state.loading)
    const dispatch = useDispatch()

    const onDrop = acceptedFiles => {

        const file = acceptedFiles[0]
        
        if (!acceptedFiles.length &&  (!file.name.endsWith('.fits') || !file.name.endsWith('.fz') || !file.name.endsWith('.fit')) ) { return }
        
        if (file)
            dispatch(openFile(file.path))

    }

    const { isDragActive, getRootProps, getInputProps, acceptedFiles } = useDropzone({
        onDrop,
        accept: ['.fits','.fz','.fit'],
        multiple: false,

    })
    const acceptedFilesItems = acceptedFiles.map(file => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ))

    return (<div id="openseadragonViewer" {...getRootProps()} >
        {output_png === '' && <div className={`logo ${isDragActive ? 'dragActive' : ''}`}  >
            <input {...getInputProps()} />
            <div className='imglg'>
                <img src={logo} alt="FITS Liberator" />
                {!isDragActive && <TextAnimate >Drop FITS file to process!</TextAnimate>}
                {isDragActive && <p>Drop it!</p>}
                {acceptedFilesItems}                
            </div>
        </div>}

        <PreviewLoader  loading={loading} />        
    </div>
    )
})

export default Preview
