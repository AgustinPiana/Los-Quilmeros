import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'publicacion',
  title: 'Publicación',
  type: 'document',
  fields: [
    defineField({
      name: 'titulo',
      title: 'Título',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {source: 'titulo', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'fecha',
      title: 'Fecha de publicación',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'categoria',
      title: 'Categoría',
      type: 'string',
    }),
    defineField({
      name: 'resumen',
      title: 'Resumen corto',
      type: 'text',
      rows: 3,
      description: 'Se muestra en las tarjetas de la home.',
      validation: (Rule) => Rule.required().max(220),
    }),
    defineField({
      name: 'cuerpo',
      title: 'Texto completo',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'imagen',
      title: 'Fotografía',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'destacada',
      title: '¿Es la publicación principal de la home?',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})
