import React from 'react'
import ContentLoader from 'react-content-loader'
import './ImageHeaderModal.scss'

/** 
 * 🔨 Redux
 */
import { connect } from 'react-redux'
import Modal from './Modal'


const Loader = (props) => <ContentLoader
    height={200}
    width={400}
    speed={2}
    viewBox="0 0 400 200"
    backgroundColor="#d9d9d9"
    foregroundColor="#ecebeb"
    {...props}
>
    <rect x="15" y="15" rx="4" ry="4" width="130" height="10" />
    <rect x="155" y="15" rx="3" ry="3" width="130" height="10" />
    <rect x="295" y="15" rx="3" ry="3" width="90" height="10" />
    <rect x="15" y="50" rx="3" ry="3" width="90" height="10" />
    <rect x="115" y="50" rx="3" ry="3" width="60" height="10" />
    <rect x="185" y="50" rx="3" ry="3" width="200" height="10" />
    <rect x="15" y="90" rx="3" ry="3" width="130" height="10" />
    <rect x="160" y="90" rx="3" ry="3" width="120" height="10" />
    <rect x="290" y="90" rx="3" ry="3" width="95" height="10" />
    <rect x="15" y="130" rx="3" ry="3" width="130" height="10" />
    <rect x="160" y="130" rx="3" ry="3" width="225" height="10" />


    <rect x="15" y="170" rx="4" ry="4" width="130" height="10" />
    <rect x="155" y="170" rx="3" ry="3" width="130" height="10" />
    <rect x="295" y="170" rx="3" ry="3" width="90" height="10" />
    <rect x="15" y="210" rx="3" ry="3" width="90" height="10" />
    <rect x="115" y="210" rx="3" ry="3" width="60" height="10" />
    <rect x="185" y="210" rx="3" ry="3" width="200" height="10" />
    <rect x="15" y="250" rx="3" ry="3" width="130" height="10" />
    <rect x="160" y="250" rx="3" ry="3" width="120" height="10" />
    <rect x="290" y="250" rx="3" ry="3" width="95" height="10" />
    <rect x="15" y="290" rx="3" ry="3" width="130" height="10" />
    <rect x="160" y="290" rx="3" ry="3" width="225" height="10" />
</ContentLoader>

const ImageHeadersModal = ({ loading, fitsheaders, openModal }) => {

    return (
        <Modal openModal={openModal}>
            <pre style={{ fontSize: 16, overflowY: 'auto', margin: 5, whiteSpace: 'pre' }} >
                {loading ?
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,auto)', justifyContent: 'start' }}>
                        <Loader />
                        <Loader />
                        <Loader />
                        <Loader />
                        <Loader />
                        <Loader />
                    </div>
                    : fitsheaders}
            </pre>
        </Modal>
    )
}

const mapStateToProps = state => {
    return {
        fitsheaders: state.fitsheaders,
        loading: state.loading
    }
}

export default connect(mapStateToProps)(ImageHeadersModal)