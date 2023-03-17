<div align="center">
    <h1>Japscan-PageSaver Extension</h1>

[![Chrome Web Store](https://img.shields.io/chrome-web-store/stars/oennheijilebmieelbahckofblcgkljn?label=Stars&color=brightgreen&logo=googlechrome&style=for-the-badge)](https://chrome.google.com/webstore/detail/japscanpagesaver/oennheijilebmieelbahckofblcgkljn?hl=fr&authuser=0)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/users/oennheijilebmieelbahckofblcgkljn?color=brightgreen&logo=googlechrome&style=for-the-badge)](https://chrome.google.com/webstore/detail/japscanpagesaver/oennheijilebmieelbahckofblcgkljn?hl=fr&authuser=0)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/oennheijilebmieelbahckofblcgkljn?color=brightgreen&logo=googlechrome&style=for-the-badge&label=Version)](https://chrome.google.com/webstore/detail/japscanpagesaver/oennheijilebmieelbahckofblcgkljn?hl=fr&authuser=0)
<br>
</div>

## :notebook: Description :notebook:

In the beginning, This extension was created to save the pages of the <a href="https://www.japscan.ws/">**Japscan**</a> website.

But I add some features into it like the following:

* Save the pages of the Japcan website in the background.
* Creation of a popup window that shows the saved pages and the possible news pages.
* In manga page of the Japscan website, I add button link to the anime of the manga.
* Every 24h hour I check the news of the Japscan website and if a news Chapter exist i send you a notification.

## :cd:	Download :cd:


To download this extension I invite you to go to this <a href="https://chrome.google.com/webstore/detail/japscanpagesaver/oennheijilebmieelbahckofblcgkljn?hl=fr&authuser=0">link</a>

## :computer: Architecture of project :computer:

This project was a fullstack project

* A Python3 scrapper on a vps that every hour refresh the data
* A PostgresSQL database that contains news manga
* A Express back-end on a vps that connect Database too the Chromme Extension
* A Chrome extension using vanillaJS and ChartJs 

## :camera_flash: Images :camera_flash:

* Popup View:
    <br>
    <a href="https://i.imgur.com/Kiuib0c.png"><img src="https://i.imgur.com/B8gvAGw.png" title="Popup" width="400px"/></a>

* Site View (Dark Theme):
    <br>
    <a href="https://i.imgur.com/oFIj4Yf.png"><img src="https://imgur.com/emLge8c.png" title="Site avec modification" /></a>
