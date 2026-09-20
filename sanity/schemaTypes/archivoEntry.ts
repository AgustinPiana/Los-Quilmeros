import {defineField, defineType} from 'sanity'

// Documento destino del script de importación del blogspot (scripts/import-blogspot.mjs).
// No se carga a mano: se completa automáticamente al correr el import.
export default defineType({
  name: 'archivoEntry',
  title: 'Archivo El Quilmero (importado)',
  type: 'document',
  fields: [
    defineField({name: 'titulo', title: 'Título original', type: 'string'}),
    defineField({name: 'fecha', title: 'Fecha de publicación original', type: 'datetime'}),
    defineField({name: 'resumen', title: 'Resumen (auto-generado)', type: 'text'}),
    defineField({
      name: 'etiquetas',
      title: 'Etiquetas del blog',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({name: 'urlOriginal', title: 'URL en el blogspot', type: 'url'}),
    defineField({name: 'imagen', title: 'Imagen destacada', type: 'image'}),
    defineField({name: 'blogPostId', title: 'ID del post en Blogger', type: 'string', readOnly: true}),
  ],
  preview: {
    select: {title: 'titulo', fecha: 'fecha'},
  },
})
