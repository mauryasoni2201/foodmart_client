import UsersListing from "./UserListing";

export default interface UserInformation extends UsersListing{
    address:string;
    gender:"male"|"female";
    mobile:number|any;
}