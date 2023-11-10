function todoFiltering(query) {
    // extract the query parameters from the request
    const { filterId, filterTitle, filterTaskDescription, filterUser } = query;
    
    // for each query parameter, add it to the filterQuery object
    const filterQuery = {
        // filterId will match todos with the specified id
        ...(filterId && { _id: filterId }),
        // filterTitle will match todos with the specified title
        ...(filterTitle && { title: filterTitle }),
        // filterTaskDescription will match todos with the specified task
        ...(filterTaskDescription && { task: filterTaskDescription }),
        // filterUser will match todos with the specified user
        ...(filterUser && { createdBy: filterUser }),
    }

    return filterQuery;
}

export default todoFiltering;