import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'institucion',
  title: 'Institución',
  type: 'document',
  description:
    'Contenido de la sección "Institución": historia de la fundación, la bandera y su simbología. Debería existir un único documento de este tipo.',
  fields: [
    defineField({
      name: 'historiaTitulo',
      title: 'Título del bloque de historia',
      type: 'string',
      initialValue: 'Nuestra historia',
    }),
    defineField({
      name: 'historia',
      title: 'Historia de la fundación',
      type: 'text',
      rows: 10,
      description: 'Separá los párrafos dejando una línea en blanco entre ellos.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bandera',
      title: 'Imagen de la bandera',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'banderaIntro',
      title: 'Texto introductorio sobre la bandera',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'simbologia',
      title: 'Simbología de la bandera',
      description: 'Un ítem por cada elemento de la bandera (color, franja, símbolo, etc.) y su significado.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'simbolo',
          fields: [
            defineField({name: 'elemento', title: 'Elemento', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({
              name: 'significado',
              title: 'Qué significa',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {title: 'elemento', subtitle: 'significado'},
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Institución'}
    },
  },
})
