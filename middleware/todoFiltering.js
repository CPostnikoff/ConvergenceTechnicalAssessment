function todoFiltering(query) {
    // extract the query parameters from the request
    const { filterId, filterTitle, filterTaskDescription, filterUser } = query;
    
    // for each filtering parameter present, add it to the filterQuery object
    const filterQuery = {
        ...(filterId && { _id: filterId }),
        ...(filterTitle && { title: filterTitle }),
        ...(filterTaskDescription && { task: filterTaskDescription }),
        ...(filterUser && { createdBy: filterUser }),
    }

    return filterQuery;
}

export default todoFiltering;