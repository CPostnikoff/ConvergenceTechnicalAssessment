function todoFiltering(query) {

    const { filterId, filterTitle, filterTaskDescription, filterUser } = query;
    
    const filterQuery = {
        ...(filterId && { _id: filterId }),
        ...(filterTitle && { title: filterTitle }),
        ...(filterTaskDescription && { task: filterTaskDescription }),
        ...(filterUser && { createdBy: filterUser }),
    }

    return filterQuery;
}

export default todoFiltering;