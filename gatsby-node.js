// const path à ajouter pour le slug (voir doc node.js path.basename)
const path = require('path')

module.exports.onCreateNode = ({node, actions}) => {
     const { createNodeField } = actions

     if (node.internal.type === 'MarkdownRemark') {
        const slug = path.basename(node.fileAbsolutePath, '.md')
        //le md va être enlevé.

        createNodeField({
            node,
            name: 'slug',
            value: slug
        })
        /* console.log(JSON.stringify(node, undefined, 4)) */

     }
}

module.exports.createPages = async ({graphql, actions}) => {
    const { createPage } = actions
    // 1. Get path to template
    // 2. Get markdown data
    // 3. Create new pages
    const blogTemplate = path.resolve('./src/templates/blog.js')
    const res = await graphql(` 
        query {
            allMarkdownRemark {
                edges {
                    node {
                        fields {
                            slug
                        }
                    }
                }
            }
        }
    `)

    res.data.allMarkdownRemark.edges.forEach((edge) => {
        createPage({
            component: blogTemplate,
            path: `/blog/${edge.node.fields.slug}`,
            context: {
                slug: edge.node.fields.slug
            }
        })
    })
}