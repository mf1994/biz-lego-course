/**
 * @description 作品 数据操作
 */

const {WorkContentModel, WorkPublishContentModel} = require("../models/WorkContentModel")
const WorksModel = require('../models/WorksModel')
const UserModel = require('../models/UserModel')
const _ = require('lodash')

/**
 * @description 创建作品
 * @param {object} data
 * @param {object} content
 */
async function createWorksService(data = {}, content = {}) {
    // 创建作品内容 ---- mongoose
    const {components = [], props = {}, setting = {}} = content
    const newContent = await WorkContentModel.create({
        components,
        props,
        setting
    })
    const { _id: contentId } = newContent
    // 创建作品记录 ---- mysql
    const newWork = await WorksModel.create({
        ...data,
        contentId: contentId.toString()
    })
    console.log(newWork)
    return newWork.dataValues
}

/**
 * @description 查询单个作品
 * @param {object} whereOpt
 */
async function findOneWorkService(whereOpt = {}) {
    if (_.isEmpty(whereOpt)) return null
    // 查询作品记录 ---- mysql
    const result = await WorksModel.findOne({
        where: whereOpt,
        include: [
            // 关联User
            {
                model: UserModel,
                attributes: ['userName', 'nickName', 'gender', 'picture']
            }
        ]
    })
    if (result == null) {
        return result
    }
    const work = result.dataValues

    // 查询作品内容 ---- mongoose
    const {contentId} = work
    const content = await WorkContentModel.findById(contentId)
    return {
        ...work,
        content
    }
}

/**
 * @description 更新作品内容
 * @param {object} data
 * @param {object} whereOpt
 */
async function updateWorkService(data = {}, whereOpt = {}) {
    if (_.isEmpty(data)) return false
    if (_.isEmpty(whereOpt)) return false
    const work = await findOneWorkService(whereOpt)
    if (work == null) return false

    const updateData = data
    // 更新content ---- mongoose
    const {content} = updateData
    if (content) {
        const {contentId} = work
        await WorkContentModel.findByIdAndUpdate(contentId, {
            components: content.components || [],
            props: content.props || {},
            setting: content.setting || {}
        })
    }

    // 删除不需要更新的数据
    delete updateData.id
    delete updateData.uuid
    delete updateData.content
    delete updateData.contentId

    if (_.isEmpty(updateData)) {
        return true
    }

    // 更新数据 ---- mysql
    const result = await WorksModel.update(updateData, {where: whereOpt})
    return result[0] !== 0
}

/**
 * @description 查询作品或模板列表
 * @param {object} whereOpt
 * @param {object} pageOpt
 */
async function findWorkListService(whereOpt = {}, pageOpt = {}) {
    // --------拼接查询条件---------
    const wheres = {}

    // 1.处理特殊的查询条件
    const {title, isTemplate, status} = whereOpt
    if (title) {
        Object.assign(wheres, {
            title: {
                [Op.like]: `%${title}%`, // 模糊查询
            }
        })
        delete whereOpt.title
    }
    
    if (isTemplate != null) {
        Object.assign(wheres, {
            isTemplate: !!isTemplate
        })
        delete whereOpt.isTemplate
    }
    const statusNum = parseInt(status, 10)
    if (isNaN(statusNum)) {
        // status 无要求，则屏蔽掉删除的
        Object.assign(wheres, {
            status: {
                [Op.ne]: 0,
            },
        })
    } else {
        Object.assign(whereOpt, {
            status: statusNum
        })
    }
    delete whereOpt.status

    // 2.拼接其他查询条件
    _.forEach(whereOpt, (val, key) => {
        if (val == null) return
        whereOpt[key] = val
    })

    // ------执行查询-------
    const {pageIndex, pageSize} = pageOpt
    const pageSizeNumber = parseInt(pageSize, 10)
    const pageIndexNumber = parseInt(pageIndex, 10)
    const result = await WorksModel.findAndCountAll({
        limit: pageSizeNumber,
        offset: pageSizeNumber * pageIndexNumber,
        order: [
            ['orderIndex', 'desc'], // 倒序
            ['id', 'desc'], // 倒序。多个排序，按先后顺序确定优先级
        ],
        where: wheres,
        include: [
            // 关联 User
            {
                model: UserModel,
                attributes: ['userName', 'nickName', 'gender', 'picture'],
            },
        ],
    })

    const list = result.rows.map(row => row.dataValues)
    return {
        count: result.count,
        list
    }
}

/**
 * @description 更新发布内容
 * @param {object} content
 * @param {string|null} publishContentId
 */
async function updatePublishContentService(content, publishContentId) {
    if (!content) return null
    const {components = [], props = {}, setting = {}} = content
    // 已发布
    if (publishContentId) {
        await WorkPublishContentModel.findByIdAndUpdate(publishContentId, {
            components,
            props,
            setting
        })
        return publishContentId
    }
    // 还没有发布
    const newPublishContent = await WorkPublishContentModel.create({
        components,
        props,
        setting
    })
    return newPublishContent._id.toString()
}


module.exports = {
    createWorksService,
    findOneWorkService,
    updateWorkService,
    findWorkListService,
    updatePublishContentService
}