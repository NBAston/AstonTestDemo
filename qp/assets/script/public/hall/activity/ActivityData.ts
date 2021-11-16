
export class UIActivityData {

}
export class UIActivityCopyData extends UIActivityData {
    url: string;
}
export class UIActivityQRCodeData extends UIActivityData {
    url: string;
}

export class UIActivityItemData {
    type: string;
    
    data: UIActivityData;
}