<?php
/**
 * The template for displaying all pages.
 */

$template = array( 'page-' . $post->post_name . '.twig', 'page.twig' );
$context = Timber::get_context();
$post = new TimberPost();
$context['post'] = $post;

$args = array(
    // Get post type project
    'post_type' => 'post',
    // Get all posts
    'posts_per_page' => -1,
);

$context['posts'] = Timber::get_posts( $args );
$context['body_class']  = 'archive'. $post->post_type;

Timber::render($template, $context);