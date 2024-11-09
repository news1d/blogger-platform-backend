import {query} from 'express-validator';

export const validateBlogQueryParams = [
    query('pageNumber')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page number must be an integer greater than or equal to 1.'),

    query('pageSize')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page size must be an integer greater than or equal to 1.'),

    query('sortBy')
        .optional()
        .isString()
        .withMessage('Sort by must be a string.')
        .default('createdAt'),

    query('sortDirection')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('Sort direction must be "asc" or "desc".')
        .default('desc'),

    query('searchNameTerm')
        .optional()
        .trim()
        .isString()
        .withMessage('Search name term must be a string.')
]

export const validateUserQueryParams = [
    query('pageNumber')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page number must be an integer greater than or equal to 1.'),

    query('pageSize')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page size must be an integer greater than or equal to 1.'),

    query('sortBy')
        .optional()
        .isString()
        .withMessage('Sort by must be a string.')
        .default('createdAt'),

    query('sortDirection')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('Sort direction must be "asc" or "desc".')
        .default('desc'),

    query('searchLoginTerm')
        .optional()
        .trim()
        .isString()
        .withMessage('Search login term must be a string.'),

    query('searchEmailTerm')
        .optional()
        .trim()
        .isString()
        .withMessage('Search email term must be a string.')
]