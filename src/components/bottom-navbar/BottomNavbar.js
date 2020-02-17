import React, { useRef, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import './BottomNavbar.scss';

import syncIcon from './../../assets/icons/svgs/upload.svg';
import logoutIcon from './../../assets/icons/svgs/switch.svg';
import property from './../../assets/icons/svgs/property.svg';
import textDocument from './../../assets/icons/svgs/text-document.svg';
import addSquare from './../../assets/icons/svgs/add-square.svg';
import ajaxLoaderGray from './../../assets/gifs/ajax-loader--gray.gif';
import { syncUserData, deleteLocalData } from '../../utils/sync/sync';

const BottomNavbar = (props) => {
    const syncBtn = useRef(null);
    const logoutBtn = useRef(null);
    const cameraBtn = useRef(null);
    const uploadBtn = useRef(null);
    const history = useHistory();

    const logout = async () => {
        const localStorageCleared = await deleteLocalData(props.offlineStorage);
        if (!localStorageCleared) {
            alert('failed to clear local data');
        }
        window.location.href = "/"; // token is wiped out as it's set by state not in storage
    }

    const saveToDevice = () => {
        props.saveToDevice();
    }

    // propogates upward click intent to then be received by AddTag body
    const openCamera = () => {
        props.triggerLoadCamera(true);
    }

    // this probably shouldn't be here but just an initializer
    const sync = async () => {
        if (!props.appOnline) { // shouldn't be needed disabled buttons
            alert('Unable to sync, you are offline');
            return;
        }

        if (!props.token) {
            alert('Please login to sync');
            history.push("/login");
            return;
        }

        if (!props.syncApp) {
            props.setSyncApp(true);
            const synced = await syncUserData(props);

            if (Object.keys(synced).length) {
                if (synced.msg !== "undefined") {
                    if (synced.msg === 403) {
                        alert('You have been logged out, please login to sync');
                    } else {
                        alert(synced.msg);
                    }
                }
            } else if (synced) {
                // await updateLocalStorageFromSync(props, synced);
                alert('Sync successful');
            } else {
                alert('Failed to sync');
            }

            props.setSyncApp(false);
        }
    }

    const uploadImages = () => {
        if (!props.appOnline) {
            alert('Unable to upload, you are offline');
            return;
        }

        if (!props.token) {
            alert('Please login to upload');
            history.push("/login");
            return;
        }

        props.triggerFileUpload(true);
    }

    const renderBottomNavbar = (routeLocation) => {
        const address = props.location.state;

        switch(routeLocation.pathname) {
            case "/":
            case "/addresses":
                return <>
                    <button onClick= { sync } ref={ syncBtn } className="bottom-navbar__btn half sync"
                    type="button" disabled={ props.appOnline ? false : true }>
                        {props.syncApp
                            ? <>
                                <span>Syncing...</span>
                                <img src={ ajaxLoaderGray } alt="sync button" />
                            </>
                            : <>
                                <img src={ syncIcon } alt="sync button" />
                                <span>Sync</span>
                            </>
                        }
                    </button>
                    <button ref={ logoutBtn } onClick={ logout } className="bottom-navbar__btn half" type="button">
                        <img src={ logoutIcon } alt="logout button" />
                        <span>Logout</span>
                    </button>
                </>
            case "/view-address":
            case "/edit-tags":
                return <>
                    <Link
                        to={{ pathname: "/owner-info", state: {
                                address: address.address,
                                addressId: address.addressId // used for lookup
                        }}}
                        className="bottom-navbar__btn third">
                        <img src={ property } alt="home owner button" />
                        <span>Owner Info</span>
                    </Link>
                    <Link
                        to={{ pathname: "/tag-info", state: {
                                address: address.address,
                                addressId: address.addressId // used for lookup
                        }}}
                        className="bottom-navbar__btn third">
                        <img src={ textDocument } alt="tag info button" />
                        <span>Tag Info</span>
                    </Link>
                    <Link
                        to={{ pathname: "/add-tag", state: {
                            address: address.address,
                            addressId: address.addressId // used for lookup
                        }}}
                        className="bottom-navbar__btn third">
                        <img src={ addSquare } alt="add tag" />
                        <span>Add Tag</span>
                    </Link>
                </>
            case "/add-tag":
                return <>
                    <button ref={ cameraBtn } onClick={ openCamera } className="bottom-navbar__btn quarter caps-blue border small-font" type="button">
                        <span>Use Camera</span>
                    </button>
                    <button ref={ uploadBtn } onClick={ uploadImages } className="bottom-navbar__btn quarter caps-blue border small-font" type="button" disabled={ props.loadedPhotos.length ? false : true }>
                        <span>Upload</span>
                    </button>
                    <button
                        onClick={ saveToDevice }
                        className="bottom-navbar__btn quarter caps-blue border small-font"
                        type="button"
                        disabled={ props.savingToDevice ? true : false }>
                        <span>Save To Device</span>
                    </button>
                    <Link
                        to={{ pathname: "/view-address", state: {
                            address: address.address,
                            addressId: address.addressId // used for lookup
                        }}}
                        className="bottom-navbar__btn quarter caps-blue small-font">
                        <span>Cancel</span>
                    </Link>
                </>
            case "/tag-info":
            case "/owner-info":
                const tagPath = props.location.pathname === "/tag-info";

                return <>
                    <Link
                        to={{ pathname: "/owner-info", state: {
                                address: address.address,
                                addressId: address.addressId // used for lookup
                        }}}
                        className={"bottom-navbar__btn toggled " + (!tagPath ? "active" : "") }>
                        <img src={ property } alt="home owner button" />
                        <span>Owner Info</span>
                    </Link>
                    <Link
                        to={{ pathname: "/tag-info", state: {
                                address: address.address,
                                addressId: address.addressId // used for lookup
                        }}}
                        className={"bottom-navbar__btn toggled " + (tagPath ? "active" : "") }>
                        <img src={ textDocument } alt="tag info button" />
                        <span>Tag Info</span>
                    </Link>
                </>
            default:
                return null;
        }
    }

    const getBottomNavbarClasses = () => {
        const floatingBtnPaths = [
            "/owner-info",
            "/tag-info"
        ];

        const floatingBtns = floatingBtnPaths.indexOf(props.location.pathname) !== -1;

        if (floatingBtns) {
            return "tagging-tracker__bottom-navbar floating-btns";
        }

        return "tagging-tracker__bottom-navbar";
    }

    return(
        <div className={ getBottomNavbarClasses() }>
            { renderBottomNavbar(props.location) }
        </div>
    )
}

export default BottomNavbar;