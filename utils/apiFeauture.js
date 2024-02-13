class Apifeautures {
    constructor(query,querystr){
        this.query = query;
        this.querystr = querystr;
    }

    //search feauture
    search(){
    const keyword = this.querystr.keyword ? {
        name:{
            $regex:this.querystr.keyword,
            $options: 'i', //casesenstive
        }
    } : {};



    this.query = this.query.find({...keyword});
    return this;
    }

 
        
}

module.exports = Apifeautures