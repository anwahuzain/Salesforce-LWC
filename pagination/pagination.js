import { LightningElement, api } from 'lwc';
import getContact from '@salesforce/apex/Accounts.getContacts';

const chunk = (arr, size) => {
    const chunkedArray = [];
    for (let i = 0; i < arr.length; i++) {
       const last = chunkedArray[chunkedArray.length - 1];
       if(!last || last.length == size){
          chunkedArray.push([arr[i]]);
       }else{
          last.push(arr[i]);
       }
    };
    return chunkedArray;
};

export default class Pagination extends LightningElement {

    @api contactList;
    @api contactChunks;
    contactToDisplay;
    size;
    currentPage = 1;
    pageLimit="10";
    totalPages=1;
    pageOptions=[];
    disableNext = false;
    disablePrev = false;

    columns = [
        { label: 'First Name', fieldName: 'FirstName', type: 'text' },
    ];

    get pageSizeOptions() {
        var pageLimitList = [
            { label: '5', value: '5' },
            { label: '10', value: '10' },
            { label: '15', value: '15' },
            { label: '20', value: '20' },
        ];
        return pageLimitList;
    }

    get pageNumberOptions() {
        this.pageOptions=[];
        for(var i=1;i<=parseInt(this.totalPages);i++){
            this.pageOptions.push({
                label:i,value: i
            })
        }
        return this.pageOptions;
    }

    connectedCallback()
    {     
        getContact()
        .then(res=>{
           	this.contactList=res;
        	this.setPagination(10);
        })
        .catch(err=>{
            console.log(err);
        })
    }

    setPagination(size)
    { 
        if(this.contactList.length > 0)
        {
            this.size=size;
            this.contactChunks=chunk(this.contactList, this.size);
            this.contactToDisplay=this.contactChunks[0];
            this.totalPages=this.contactChunks.length; 
        }

        if(parseInt(this.totalPages) == 1)
        {
            this.disableNext=true;
            this.disablePrev=true;
        }

        if(parseInt(this.currentPage) <= 1)
        {
            this.disablePrev=true;
        }

        if(parseInt(this.currentPage) >= (this.totalPages))
        {
            this.disableNext=true;
        }

    }

    handleLimitChange(event) {
        this.pageLimit = event.detail.value;
        this.size = parseInt(this.pageLimit)
        this.setPagination(this.size);     
        this.currentPage = 1;
        this.disablePrev=true;
        if(parseInt(this.currentPage) >= (this.totalPages))
        {
            this.disableNext=true;
        }else{
            this.disableNext=false;
        }
        this.contactToDisplay=this.contactChunks[parseInt(this.currentPage)-1];
    }

    handlePageChange(event) {
        this.currentPage=(parseInt(event.target.value));         
        if(this.totalPages == 1)
        {
            this.disableNext=true;
            this.disablePrev=true;
        }else if(parseInt(this.currentPage) == 1)
        {
            this.disableNext=false;
            this.disablePrev=true;
        }else if(parseInt(this.currentPage) == this.totalPages)
        {
            this.disableNext=true;
            this.disablePrev=false;
        }else if(parseInt(this.currentPage) < this.totalPages)
        {
            this.disableNext=false;
            this.disablePrev=false;
        }
        this.contactToDisplay=this.contactChunks[parseInt(this.currentPage)-1];
    }

    handleNext()
    {
        this.currentPage=(parseInt(this.currentPage)+1);
        this.contactToDisplay=this.contactChunks[parseInt(this.currentPage)-1];
        if(parseInt(this.currentPage) >= this.totalPages)
        {
            this.currentPage=(parseInt(this.currentPage));
            this.disableNext=true;
            this.disablePrev=false;
        }
        else
        {
            this.disableNext=false;
            this.disablePrev=false;
        }
    }

    handlePrev()
    {
        this.currentPage=(parseInt(this.currentPage)-1);
        if(parseInt(this.currentPage) <= "1")
        {
            this.currentPage=(parseInt(this.currentPage));
            this.disableNext=false;
            this.disablePrev=true;
        }
        else
        {
            this.disableNext=false;
            this.disablePrev=false;
        }
        this.contactToDisplay=this.contactChunks[parseInt(this.currentPage)-1];
    }
    
}