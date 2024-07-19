class ApiFeature {
    constructor(MongooseQuery, searchQuery) {
        this.MongooseQuery = MongooseQuery;
        this.searchQuery = searchQuery;
    }

    filter() {
        const query = structuredClone(this.searchQuery);
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(field => delete query[field]);

        let queryStr = JSON.stringify(query);
        queryStr = queryStr.replace(/\b(gt|lt|gte|lte|in)\b/g, match => `$${match}`);

        this.MongooseQuery = this.MongooseQuery.find(JSON.parse(queryStr));
        return this;
    }

    sort() {
        if (this.searchQuery.sort) {
            const sortBy = this.searchQuery.sort.split(',').join(' ');
            this.MongooseQuery = this.MongooseQuery.sort(sortBy);
        }
        return this;
    }

    paginate() {
        const page = parseInt(this.searchQuery.page, 10) || 1;
        const limit = parseInt(this.searchQuery.limit, 10) || 10;
        const skip = (page - 1) * limit;
        this.MongooseQuery = this.MongooseQuery.skip(skip).limit(limit);
        return this;
    }

search() {
    if (this.searchQuery.search) {
        console.log('Search Query:', this.searchQuery.search); // Debugging line

        // Create the search conditions for each field
        const searchConditions = {
            $or: [
                { name: { $regex: this.searchQuery.search, $options: 'i' } },
                { description: { $regex: this.searchQuery.search, $options: 'i' } },
                { price: { $regex: this.searchQuery.search, $options: 'i' } },
                { category: { $regex: this.searchQuery.search, $options: 'i' } },
                { slug: { $regex: this.searchQuery.search, $options: 'i' } }
                // Add more fields as needed
            ]
        };
        // Apply the search conditions to the query
        this.MongooseQuery = this.MongooseQuery.find(searchConditions);
    }
    return this;
}
    selectFields() {
        if (this.searchQuery.fields) {
            const fields = this.searchQuery.fields.split(',').join(' ');
            this.MongooseQuery = this.MongooseQuery.select(fields);
        }
        return this;
    }
}

export default ApiFeature;
